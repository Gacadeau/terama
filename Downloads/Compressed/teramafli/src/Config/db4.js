import { createPool } from 'mysql2/promise';

// const pool = createPool({
//   host: 'www.db4free.net',
//   user: 'terama_20819u',
//   password: 'Promotion@11',
//   database: 'terama_20819u',
//   connectionLimit: 50, // Nombre maximal de connexions
//  });

 const pool = createPool({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'teramaflix',
   connectionLimit: 50, // Nombre maximal de connexions
   });
 
// Vérifiez si la connexion est ouverte avant d'exécuter une requête
const executeQuery = async (query, params) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(query, params);
    return rows;
  } catch (error) {
    console.error('Une erreur s\'est produite lors de l\'exécution de la requête :', error);

  } finally {
    if (connection) {
      connection.release(); // Libérer la connexion après l'exécution de la requête
    }
  }
};

export default executeQuery;