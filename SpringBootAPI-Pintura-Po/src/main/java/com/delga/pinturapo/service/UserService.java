package com.delga.pinturapo.service;

import com.delga.pinturapo.dto.CreateUserRequest;
import com.delga.pinturapo.dto.UserResponse;
import com.delga.pinturapo.entity.User;
import com.delga.pinturapo.exception.BusinessException;
import com.delga.pinturapo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse create(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new BusinessException("Já existe um usuário com esse nome de usuário.");
        }

        User user = User.builder()
                .username(request.username().trim())
                .password(passwordEncoder.encode(request.password()))
                .nome(request.nome().trim())
                .role(request.role())
                .ativo(true)
                .build();

        return UserResponse.from(userRepository.save(user));
    }

    public List<UserResponse> findAll() {
        return userRepository.findAll().stream().map(UserResponse::from).toList();
    }

    @Transactional
    public void setAtivo(Long id, boolean ativo) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado."));
        user.setAtivo(ativo);
        userRepository.save(user);
    }

    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new BusinessException("Usuário não encontrado.");
        }
        userRepository.deleteById(id);
    }
}
