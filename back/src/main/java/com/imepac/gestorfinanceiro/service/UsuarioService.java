package com.imepac.gestorfinanceiro.service;

import com.imepac.gestorfinanceiro.dto.LoginRequestDTO;
import com.imepac.gestorfinanceiro.dto.UsuarioRequestDTO;
import com.imepac.gestorfinanceiro.dto.UsuarioResponseDTO;
import com.imepac.gestorfinanceiro.model.Usuario;
import com.imepac.gestorfinanceiro.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO dto) {
        if (repository.existsByEmail(dto.email())) {
            throw new RuntimeException("Este e-mail já está cadastrado na Nexus!");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(dto.senha()); // TODO: aplicar BCrypt futuramente

        Usuario salvo = repository.save(usuario);
        return toResponse(salvo);
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return repository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UsuarioResponseDTO buscarPorId(Long id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        return toResponse(usuario);
    }

    public UsuarioResponseDTO autenticar(LoginRequestDTO dto) {
        Usuario usuario = repository.findByEmail(dto.email())
                .orElseThrow(() -> new RuntimeException("E-mail ou senha inválidos."));

        if (!usuario.getSenha().equals(dto.senha())) {
            throw new RuntimeException("E-mail ou senha inválidos.");
        }

        return toResponse(usuario);
    }

    private UsuarioResponseDTO toResponse(Usuario usuario) {
        return new UsuarioResponseDTO(usuario.getId(), usuario.getNome(), usuario.getEmail());
    }
}
