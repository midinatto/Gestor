package com.imepac.gestorfinanceiro.dto;

import com.imepac.gestorfinanceiro.model.enums.TipoTransacao;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TransacaoRequestDTO(
        String descricao,
        BigDecimal valor,
        LocalDate data,
        TipoTransacao tipo,
        Long usuarioId,
        Long categoriaId
) {}