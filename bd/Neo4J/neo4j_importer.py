from pymongo import MongoClient
from neo4j import GraphDatabase
import re

# Configuración MongoDB
MONGO_URI = 'mongodb://localhost:27017/'
MONGO_DB = 'PcBuilderPro_MongoDB'
COLECCIONES = [
    'productos_procesados/case_productos',
    'productos_procesados/cooler_productos',
    'productos_procesados/graphic-card_productos',
    'productos_procesados/memory_productos',
    'productos_procesados/motherboard_productos',
    'productos_procesados/power-supply_productos',
    'productos_procesados/processor_productos',
    'productos_procesados/storage_productos'
]

# Configuración Neo4j
NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "12345678"

# ------------------------
# Funciones auxiliares
# ------------------------

def limpiar_texto(texto):
    texto = texto.lower()
    texto = re.sub(r'[áàäâ]', 'a', texto)
    texto = re.sub(r'[éèëê]', 'e', texto)
    texto = re.sub(r'[íìïî]', 'i', texto)
    texto = re.sub(r'[óòöô]', 'o', texto)
    texto = re.sub(r'[úùüû]', 'u', texto)
    texto = re.sub(r'[^\w\s,]', '', texto)  # Solo letras, números, espacios y comas
    texto = re.sub(r'\s+', ' ', texto).strip()
    return texto

def procesar_caracteristicas(caracteristicas):
    resultado = []
    for clave, valor in caracteristicas.items():
        clave_limpia = limpiar_texto(clave)
        if isinstance(valor, str) and ',' in valor:
            valores = [limpiar_texto(v) for v in valor.split(',')]
            for v in valores:
                resultado.append({'caracteristica': clave_limpia, 'valor': v})
        else:
            resultado.append({'caracteristica': clave_limpia, 'valor': limpiar_texto(str(valor))})
    return resultado

# ------------------------
# Extracción de MongoDB
# ------------------------

def extraer_datos():
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB]
    documentos = []
    for coleccion in COLECCIONES:
        print(f'Extrayendo de {coleccion}')
        documentos += list(db[coleccion].find({}, {'Nombre': 1, 'Características': 1, 'categoria': 1, '_id': 0}))
    client.close()
    return documentos

# ------------------------
# Inserción en Neo4j
# ------------------------

def crear_producto(tx, nombre, categoria):
    tx.run("""
        MERGE (p:Producto {nombre: $nombre})
        SET p.categoria = $categoria
    """, nombre=nombre, categoria=categoria)

def crear_caracteristica(tx, nombre_producto, caracteristica, valor):
    tx.run("""
        MATCH (p:Producto {nombre: $nombre_producto})
        MERGE (c:Caracteristica {tipo: $caracteristica, valor: $valor})
        MERGE (p)-[:TIENE_CARACTERISTICA]->(c)
    """, nombre_producto=nombre_producto, caracteristica=caracteristica, valor=valor)

def insertar_en_neo4j(documentos):
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    with driver.session() as session:
        for doc in documentos:
            nombre = limpiar_texto(doc['Nombre'])
            categoria = limpiar_texto(doc['categoria'])
            caracteristicas_procesadas = procesar_caracteristicas(doc.get('Características', {}))

            session.execute_write(crear_producto, nombre, categoria)
            for carac in caracteristicas_procesadas:
                session.execute_write(crear_caracteristica, nombre, carac['caracteristica'], carac['valor'])
    driver.close()

# ------------------------
# Ejecución
# ------------------------

if __name__ == "__main__":
    print('Iniciando extracción de MongoDB...')
    documentos = extraer_datos()
    print(f'{len(documentos)} documentos extraídos.')

    print('Iniciando inserción en Neo4j...')
    insertar_en_neo4j(documentos)
    print('Migración completada exitosamente.')
