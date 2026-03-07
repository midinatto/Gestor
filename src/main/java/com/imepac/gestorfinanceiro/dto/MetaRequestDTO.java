package com.imepac.gestorfinanceiro.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record MetaRequestDTO(
        String nome,
        BigDecimal valorObjetivo,
        LocalDate dataLimite,
        List<Long> usuariosIds // Aqui está a mágica da dupla/grupo!
) {}