package com.delga.pinturapo.config;

import com.delga.pinturapo.entity.Role;
import com.delga.pinturapo.entity.User;
import com.delga.pinturapo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Garante que sempre existam pelo menos 2 usuários no sistema (um ADMIN e
 * um OPERADOR), criados a partir de variáveis de ambiente no primeiro
 * start. Se os usuários já existirem, não faz nada.
 *
 * IMPORTANTE: troque as senhas padrão em produção via variáveis de
 * ambiente (ADMIN_PASSWORD / OPERADOR_PASSWORD) — veja application.properties.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.init.admin.username}")
    private String adminUsername;
    @Value("${app.init.admin.password}")
    private String adminPassword;
    @Value("${app.init.admin.nome}")
    private String adminNome;

    @Value("${app.init.operador.username}")
    private String operadorUsername;
    @Value("${app.init.operador.password}")
    private String operadorPassword;
    @Value("${app.init.operador.nome}")
    private String operadorNome;

    @Override
    public void run(String... args) {
        criarSeNaoExistir(adminUsername, adminPassword, adminNome, Role.ADMIN);
        criarSeNaoExistir(operadorUsername, operadorPassword, operadorNome, Role.OPERADOR);
    }

    private void criarSeNaoExistir(String username, String password, String nome, Role role) {
        if (userRepository.existsByUsername(username)) return;

        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .nome(nome)
                .role(role)
                .ativo(true)
                .build();

        userRepository.save(user);
        log.info("Usuário inicial criado: {} (role {})", username, role);
    }
}
