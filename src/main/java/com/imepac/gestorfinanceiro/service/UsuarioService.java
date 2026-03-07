package com.imepac.gestorfinanceiro.service;

import com.imepac.gestorfinanceiro.dto.UsuarioRequestDTO;
import com.imepac.gestorfinanceiro.dto.UsuarioResponseDTO;
import com.imepac.gestorfinanceiro.model.Usuario;
import com.imepac.gestorfinanceiro.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    // Injeção de dependência via construtor (melhor prática!)
    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO dto) {
        // Regra de negócio: não deixar cadastrar e-mail duplicado
        if (repository.existsByEmail(dto.email())) {
            throw new RuntimeException("Este e-mail já está cadastrado na Nexus!");
        }

        // Transforma o DTO na Entidade que o banco entende
        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(dto.senha()); // No futuro, vamos aplicar criptografia BCrypt aqui!

        // Salva no banco de dados
        Usuario usuarioSalvo = repository.save(usuario);

        // Retorna a resposta bonitinha sem a senha
        return new UsuarioResponseDTO(
                usuarioSalvo.getId(),
                usuarioSalvo.getNome(),
                usuarioSalvo.getEmail()
        );
    }
}