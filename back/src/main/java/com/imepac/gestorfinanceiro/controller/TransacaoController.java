package com.imepac.gestorfinanceiro.controller;

import com.imepac.gestorfinanceiro.dto.TransacaoRequestDTO;
import com.imepac.gestorfinanceiro.dto.TransacaoResponseDTO;
import com.imepac.gestorfinanceiro.model.Transacao;
import com.imepac.gestorfinanceiro.service.TransacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/transacoes")
public class TransacaoController {

    private final TransacaoService service;

    public TransacaoController(TransacaoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TransacaoResponseDTO> registrar(@RequestBody TransacaoRequestDTO dto) {
        TransacaoResponseDTO resposta = service.criarTransacao(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    // Ex: GET /api/transacoes/usuario/1
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<TransacaoResponseDTO>> listarDoUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(service.listarPorUsuario(usuarioId));
    }
    // Ex: GET /api/transacoes/usuario/1/saldo
    @GetMapping("/usuario/{usuarioId}/saldo")
    public ResponseEntity<BigDecimal> obterSaldo(@PathVariable Long usuarioId) {
        BigDecimal saldo = service.calcularSaldoDoUsuario(usuarioId);
        return ResponseEntity.ok(saldo);
    }
}