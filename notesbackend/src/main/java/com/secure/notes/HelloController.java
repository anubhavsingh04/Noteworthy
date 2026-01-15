package com.secure.notes;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/hello")
    public String helloWorld() {
        return "Hello, Anubhav!";
    }
    @GetMapping("/contact")
    public String contact() {
        return "Contact details";
    }
}
