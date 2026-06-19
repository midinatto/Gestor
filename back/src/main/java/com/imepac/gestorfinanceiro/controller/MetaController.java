package com.imepac.gestorfinanceiro.controller;

import com.imepac.gestorfinanceiro.dto.AporteRequestDTO;
import com.imepac.gestorfinanceiro.dto.MetaRequestDTO;
import com.imepac.gestorfinanceiro.dto.MetaResponseDTO;
import com.imepac.gestorfinanceiro.service.MetaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metas")
public class MetaController {

    private final MetaService service;

    public MetaController(MetaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<MetaResponseDTO> criar(@RequestBody MetaRequestDTO dto) {
        MetaResponseDTO resposta = service.criarMeta(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @GetMapping
    public ResponseEntity<List<MetaResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<MetaResponseDTO>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(service.listarPorUsuario(usuarioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MetaResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}/aporte")
    public ResponseEntity<MetaResponseDTO> depositar(
            @PathVariable Long id,
            @RequestBody AporteRequestDTO dto) {
        MetaResponseDTO resposta = service.adicionarAporte(id, dto);
        return ResponseEntity.ok(resposta);
    }
}
