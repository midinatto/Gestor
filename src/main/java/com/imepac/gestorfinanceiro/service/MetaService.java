package com.imepac.gestorfinanceiro.service;

import com.imepac.gestorfinanceiro.dto.AporteRequestDTO;
import com.imepac.gestorfinanceiro.dto.MetaRequestDTO;
import com.imepac.gestorfinanceiro.dto.MetaResponseDTO;
import com.imepac.gestorfinanceiro.model.Meta;
import com.imepac.gestorfinanceiro.model.Usuario;
import com.imepac.gestorfinanceiro.repository.MetaRepository;
import com.imepac.gestorfinanceiro.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MetaService {

    private final MetaRepository metaRepository;
    private final UsuarioRepository usuarioRepository;

    public MetaService(MetaRepository metaRepository, UsuarioRepository usuarioRepository) {
        this.metaRepository = metaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public MetaResponseDTO criarMeta(MetaRequestDTO dto) {
        // Busca todos os usuários que têm os IDs passados na lista
        List<Usuario> participantes = usuarioRepository.findAllById(dto.usuariosIds());

        if (participantes.isEmpty()) {
            throw new RuntimeException("Nenhum usuário encontrado com os IDs fornecidos.");
        }

        // Monta a meta
        Meta meta = new Meta();
        meta.setNome(dto.nome());
        meta.setValorObjetivo(dto.valorObjetivo());
        meta.setValorAtual(BigDecimal.ZERO); // Começa zerada
        meta.setDataLimite(dto.dataLimite());

        // Converte a List para Set e adiciona os participantes
        meta.setUsuarios(new HashSet<>(participantes));

        Meta salva = metaRepository.save(meta);

        // Pega só os nomes para devolver na resposta
        List<String> nomes = salva.getUsuarios().stream()
                .map(Usuario::getNome)
                .collect(Collectors.toList());

        return new MetaResponseDTO(
                salva.getId(), salva.getNome(), salva.getValorObjetivo(),
                salva.getValorAtual(), salva.getDataLimite(), nomes
        );
    }
    // Adicione também a importação do AporteRequestDTO lá em cima!

    public MetaResponseDTO adicionarAporte(Long metaId, AporteRequestDTO dto) {
        // 1. Busca a meta no banco
        Meta meta = metaRepository.findById(metaId)
                .orElseThrow(() -> new RuntimeException("Meta não encontrada."));

        // 2. Soma o dinheiro novo ao valor que já estava guardado
        BigDecimal novoValor = meta.getValorAtual().add(dto.valor());
        meta.setValorAtual(novoValor);

        // 3. Salva a alteração
        Meta salva = metaRepository.save(meta);

        // 4. Monta a resposta
        List<String> nomes = salva.getUsuarios().stream()
                .map(Usuario::getNome)
                .collect(Collectors.toList());

        return new MetaResponseDTO(
                salva.getId(), salva.getNome(), salva.getValorObjetivo(),
                salva.getValorAtual(), salva.getDataLimite(), nomes
        );
    }
}