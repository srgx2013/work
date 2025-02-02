# Separar X e y
from sklearn.utils.fixes import pd


df = pd.read_csv(
    "/Users/saulrosas/dev/saul/work/Proyecto-ma/dftrain.csv", encoding="latin-1"
)
X = df.drop(_convert_column_config_to_json=["RESPUESTA_BINARIA"])
y = df["RESPUESTA_BINARIA"]

# Aplicar SMOTE para balancear la clase minoritaria
smote = SMOTE(
    sampling_strategy=0.4, random_state=42
)  # La clase minoritaria será el 50% de la mayoritaria
X_resampled, y_resampled = smote.fit_resample(X, y)

# Ver distribución después del balanceo
print("Distribución después del balanceo:")
print(y_resampled.value_counts(normalize=True))

# Dividir los datos balanceados en entrenamiento y prueba (70% entrenamiento, 30% prueba)
X_train, X_test, y_train, y_test = train_test_split(
    X_resampled, y_resampled, test_size=0.20, random_state=42
)

# Crear el modelo Random Forest
rf_model = RandomForestClassifier(random_state=42)

# Entrenar el modelo
rf_model.fit(X_train, y_train)

# Realizar predicciones sobre el conjunto de prueba
y_pred = rf_model.predict(X_test)

# Evaluar el modelo
print("Matriz de confusión:")
print(confusion_matrix(y_test, y_pred))

print("\nReporte de clasificación:")
print(classification_report(y_test, y_pred))
