package com.imepac.gestorfinanceiro.service;

import com.imepac.gestorfinanceiro.dto.TransacaoRequestDTO;
import com.imepac.gestorfinanceiro.dto.TransacaoResponseDTO;
import com.imepac.gestorfinanceiro.model.Categoria;
import com.imepac.gestorfinanceiro.model.Transacao;
import com.imepac.gestorfinanceiro.model.Usuario;
import com.imepac.gestorfinanceiro.repository.CategoriaRepository;
import com.imepac.gestorfinanceiro.repository.TransacaoRepository;
import com.imepac.gestorfinanceiro.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;

    public TransacaoService(TransacaoRepository transacaoRepository,
                            UsuarioRepository usuarioRepository,
                            CategoriaRepository categoriaRepository) {
        this.transacaoRepository = transacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public TransacaoResponseDTO criarTransacao(TransacaoRequestDTO dto) {
        // Busca o usuário e a categoria no banco (ou lança erro se não achar)
        Usuario usuario = usuarioRepository.findById(dto.usuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada."));

        // Monta a transação
        Transacao transacao = new Transacao();
        transacao.setDescricao(dto.descricao());
        transacao.setValor(dto.valor());
        transacao.setData(dto.data());
        transacao.setTipo(dto.tipo());
        transacao.setUsuario(usuario);
        transacao.setCategoria(categoria);

        Transacao salva = transacaoRepository.save(transacao);

        return new TransacaoResponseDTO(
                salva.getId(), salva.getDescricao(), salva.getValor(),
                salva.getData(), salva.getTipo(),
                usuario.getNome(), categoria.getNome()
        );
    }

    public List<TransacaoResponseDTO> listarPorUsuario(Long usuarioId) {
        return transacaoRepository.findByUsuarioId(usuarioId).stream()
                .map(t -> new TransacaoResponseDTO(
                        t.getId(), t.getDescricao(), t.getValor(),
                        t.getData(), t.getTipo(),
                        t.getUsuario().getNome(), t.getCategoria().getNome()
                )).collect(Collectors.toList());
    }
    public BigDecimal calcularSaldoDoUsuario(Long usuarioId) {
        List<Transacao> transacoes = transacaoRepository.findByUsuarioId(usuarioId);

        BigDecimal totalEntradas = transacoes.stream()
                .filter(t -> t.getTipo() == com.imepac.gestorfinanceiro.model.enums.TipoTransacao.ENTRADA)
                .map(Transacao::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalSaidas = transacoes.stream()
                .filter(t -> t.getTipo() == com.imepac.gestorfinanceiro.model.enums.TipoTransacao.SAIDA)
                .map(Transacao::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return totalEntradas.subtract(totalSaidas);
    }
}

