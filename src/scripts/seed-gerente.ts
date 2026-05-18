import { AppDataSource } from "../config/data-source";
import { Usuario } from "../models/entities/usuario";
import { RolUsuario } from "../models/enums/rol-usuario";
import { hashSHA256 } from "../services/utils/utils";

async function seedGerente() {
  try {
    await AppDataSource.initialize();
    console.log("Base de datos conectada.");

    const usuarioRepository = AppDataSource.getRepository(Usuario);
    
    // Verificar si ya existe un admin
    const adminExistente = await usuarioRepository.findOneBy({ email: "admin@coffeestock.com" });
    
    if (adminExistente) {
      console.log("El usuario gerente ya existe en la base de datos.");
      process.exit(0);
    }

    const gerente = new Usuario();
    gerente.cuil = "20-12345678-9";
    gerente.nombre = "Admin";
    gerente.apellido = "Sistema";
    gerente.email = "admin@coffeestock.com";
    gerente.password = hashSHA256("Admin1234!"); // Contraseña por defecto
    gerente.rol = RolUsuario.GERENTE;

    await usuarioRepository.save(gerente);
    console.log("✅ Usuario GERENTE creado exitosamente.");
    console.log("Email: admin@coffeestock.com");
    console.log("Contraseña: Admin1234!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al crear el gerente:", error);
    process.exit(1);
  }
}

seedGerente();
