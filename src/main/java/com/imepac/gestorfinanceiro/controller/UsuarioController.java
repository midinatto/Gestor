package com.imepac.gestorfinanceiro.controller;

import com.imepac.gestorfinanceiro.dto.UsuarioRequestDTO;
import com.imepac.gestorfinanceiro.dto.UsuarioResponseDTO;
import com.imepac.gestorfinanceiro.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios") // Essa será a URL principal para usuários
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> cadastrar(@RequestBody UsuarioRequestDTO dto) {
        // Chama o service para fazer o trabalho pesado
        UsuarioResponseDTO resposta = service.criarUsuario(dto);

        // Retorna status 201 (Created) e os dados do usuário recém-criado
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }
}