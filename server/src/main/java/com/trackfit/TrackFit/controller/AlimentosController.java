package com.trackfit.TrackFit.controller;

import com.trackfit.TrackFit.entity.Alimentos;
import com.trackfit.TrackFit.repository.AlimentosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/alimentos")
public class AlimentosController {

    @Autowired
    private AlimentosRepository alimentosRepository;

    @GetMapping
    public Page<Alimentos> listarAlimentos(Pageable pageable){
        return alimentosRepository.findAll(pageable);
    }
}
