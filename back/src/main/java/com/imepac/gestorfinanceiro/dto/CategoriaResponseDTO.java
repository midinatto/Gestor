package com.imepac.gestorfinanceiro.dto;

import com.imepac.gestorfinanceiro.model.enums.TipoCategoria;

public record CategoriaResponseDTO(Long id, String nome, TipoCategoria tipo) {
}