package com.imepac.gestorfinanceiro.dto;

import com.imepac.gestorfinanceiro.model.enums.TipoCategoria;

public record CategoriaRequestDTO(String nome, TipoCategoria tipo) {
}