package com.imepac.gestorfinanceiro.service;

import com.imepac.gestorfinanceiro.dto.CategoriaRequestDTO;
import com.imepac.gestorfinanceiro.dto.CategoriaResponseDTO;
import com.imepac.gestorfinanceiro.model.Categoria;
import com.imepac.gestorfinanceiro.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    public CategoriaResponseDTO criarCategoria(CategoriaRequestDTO dto) {
        Categoria categoria = new Categoria();
        categoria.setNome(dto.nome());
        categoria.setTipo(dto.tipo());

        Categoria categoriaSalva = repository.save(categoria);

        return new CategoriaResponseDTO(
                categoriaSalva.getId(),
                categoriaSalva.getNome(),
                categoriaSalva.getTipo()
        );
    }

    public List<CategoriaResponseDTO> listarTodas() {
        return repository.findAll().stream()
                .map(cat -> new CategoriaResponseDTO(cat.getId(), cat.getNome(), cat.getTipo()))
                .collect(Collectors.toList());
    }
}