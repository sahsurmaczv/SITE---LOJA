import React, { useEffect, useState } from 'react';
import './RelatedProducts.css';
import Item from '../Item/Item';
import { backend_url } from '../../App';

const RelatedProducts = ({ category, id }) => {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    fetch(`${backend_url}/relatedproducts`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category }),
    })
      .then((res) => res.json())
      .then((data) => setRelated(data))
      .catch((err) => console.error('Erro ao buscar produtos relacionados:', err));
  }, [category, id]); // 👈 atualiza ao mudar produto/categoria

  return (
    <div className='relatedproducts'>
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {related.map((item, index) => {
          if (id !== item.id) {
            return (
              <Item
                key={index}
                id={item.id}
                name={item.name}
                image={`${backend_url}${item.image}`} // 👈 URL completa
                new_price={item.new_price}
                old_price={item.old_price}
              />
            );
          } else return null;
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
