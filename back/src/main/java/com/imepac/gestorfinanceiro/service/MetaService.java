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
        List<Usuario> participantes = usuarioRepository.findAllById(dto.usuariosIds());

        if (participantes.isEmpty()) {
            throw new RuntimeException("Nenhum usuário encontrado com os IDs fornecidos.");
        }

        Meta meta = new Meta();
        meta.setNome(dto.nome());
        meta.setValorObjetivo(dto.valorObjetivo());
        meta.setValorAtual(BigDecimal.ZERO);
        meta.setDataLimite(dto.dataLimite());
        meta.setUsuarios(new HashSet<>(participantes));

        Meta salva = metaRepository.save(meta);
        return toResponse(salva);
    }

    public MetaResponseDTO adicionarAporte(Long metaId, AporteRequestDTO dto) {
        Meta meta = metaRepository.findById(metaId)
                .orElseThrow(() -> new RuntimeException("Meta não encontrada."));

        meta.setValorAtual(meta.getValorAtual().add(dto.valor()));
        Meta salva = metaRepository.save(meta);

        return toResponse(salva);
    }

    public List<MetaResponseDTO> listarTodas() {
        return metaRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<MetaResponseDTO> listarPorUsuario(Long usuarioId) {
        return metaRepository.findByUsuarios_Id(usuarioId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MetaResponseDTO buscarPorId(Long id) {
        Meta meta = metaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meta não encontrada."));
        return toResponse(meta);
    }

    private MetaResponseDTO toResponse(Meta meta) {
        List<String> nomes = meta.getUsuarios().stream()
                .map(Usuario::getNome)
                .collect(Collectors.toList());

        return new MetaResponseDTO(
                meta.getId(), meta.getNome(), meta.getValorObjetivo(),
                meta.getValorAtual(), meta.getDataLimite(), nomes
        );
    }
}
