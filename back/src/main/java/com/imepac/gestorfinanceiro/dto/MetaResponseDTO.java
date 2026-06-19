package com.imepac.gestorfinanceiro.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record MetaResponseDTO(
        Long id,
        String nome,
        BigDecimal valorObjetivo,
        BigDecimal valorAtual,
        LocalDate dataLimite,
        List<String> nomesUsuarios
) {}