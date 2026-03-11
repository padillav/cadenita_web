-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS torneo_db;
USE torneo_db;

-- 1. Tabla Categorías
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    edad_min INT NOT NULL,
    edad_max INT NOT NULL
);

-- 2. Tabla Equipos
CREATE TABLE equipos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_categoria INT NOT NULL,
    nombre_coach VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE CASCADE
);

-- 3. Tabla Jugadores
CREATE TABLE jugadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    id_equipo INT NOT NULL,
    FOREIGN KEY (id_equipo) REFERENCES equipos(id) ON DELETE CASCADE
);

-- 4. Tabla Partidos
CREATE TABLE partidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    id_equipo_local INT NOT NULL,
    id_equipo_visitante INT NOT NULL,
    marcador_local INT DEFAULT 0,
    marcador_visitante INT DEFAULT 0,
    FOREIGN KEY (id_equipo_local) REFERENCES equipos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_equipo_visitante) REFERENCES equipos(id) ON DELETE CASCADE
);