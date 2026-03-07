package com.imepac.gestorfinanceiro.repository;

import com.imepac.gestorfinanceiro.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // O Spring Data JPA já nos dá de graça métodos como:
    // save(), findById(), findAll(), deleteById()

    // Podemos criar buscas personalizadas só pelo nome do método! Ex:
    boolean existsByEmail(String email);
}