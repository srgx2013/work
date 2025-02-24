// Definición de la interfaz Props
interface Props {
  body: string;
}

// Componente Card
function Card(props: Props) {
  const { body } = props;
  return (
    <div className="Card" style={{ width: '350px' }}>
      <div className="card-body">{body}</div>
    </div>
  );
}

// Componente CardBody
export function CardBody() {
  return (
    <>
      <h5 className="card-title">Card title</h5>
      <p className="card-text">
        Some quick example text to build on the card title and make up the bulk
        of the card's content.
      </p>
      <button className="btn btn-primary">Go somewhere</button>
    </>
  );
}

// Exportación por defecto del componente Card
export default Card;
