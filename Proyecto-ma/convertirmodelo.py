from RFCbalanceado import RFCbalanceado
import joblib

# Guardar el modelo como archivo .pkl
joblib.dump(RFCbalanceado, "RFCbalanceado.pkl")

print("Modelo guardado correctamente como RFCbalanceado.pkl")
