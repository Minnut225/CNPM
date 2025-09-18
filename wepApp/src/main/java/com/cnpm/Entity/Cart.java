package com.cnpm.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Cart") // tên Table trong database
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int userId;

    //Constructors
    public Cart() {}

    public Cart(int id, int userId) {
        this.id = id;
        this.userId = userId;

    }

    //Getters and Setters
    public int getId(){
        return id;
    }

    public void setId(int id){
        this.id = id;
    }

    public int getUserId(){
        return userId;
    }

    public void setUserId(int userId){
        this.userId = userId;
    }

}
