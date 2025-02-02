import streamlit as st
import pandas as pd
import joblib
import numpy as np

# 📌 Configurar la app
st.title("🌿 Predicción con Random Forest")
st.write("Ingrese los valores para hacer una predicción.")


# 📌 Cargar el dataset automáticamente
@st.cache_data
def cargar_datos():
    return pd.read_csv("dftrain.csv")  # Reemplaza con el nombre de tu dataset


df = cargar_datos()

# 📌 Mostrar una vista previa del dataset
st.write("📊 **Vista previa del dataset:**")
st.write(df.head())

# 📌 Cargar el modelo entrenado
modelo = joblib.load("modelo_rf.pkl")

# 📌 Obtener nombres de columnas (excluyendo la variable objetivo)
columnas = [
    "EDAD",
    "SEXO",
    "TUMOR_PRIMARIO",
    "SUBTIPO_HISTOLOGICO",
    "No._METS",
    "TAMAÑO_(mm)",
    "LOCALIZACION",
    "DOSIS_(Gy)",
    "TECNICA",
    "TRATAMIENTO_SISTEMICO",
]

# 📌 Crear barra lateral para ingresar valores
st.sidebar.header("📝 Ingrese valores para la predicción")
datos_usuario = []
for col in columnas:
    valor = st.sidebar.slider(
        f"{col}", float(df[col].min()), float(df[col].max()), float(df[col].mean())
    )  # Valor por defecto: media
    datos_usuario.append(valor)

# 📌 Convertir a array numpy para la predicción
datos_usuario = np.array(datos_usuario).reshape(1, -1)

# 📌 Botón para predecir
if st.sidebar.button("🔮 Predecir"):
    prediccion = modelo.predict(datos_usuario)
    resultado = "Positivo (1)" if prediccion[0] == 1 else "Negativo (0)"
    st.sidebar.success(f"**Predicción del modelo:** {resultado}")
