import React, { useState, useEffect } from 'react';
import { Container, Spinner, Card, Row, Col } from 'react-bootstrap';
// Necessary Firestore functions for fetching a single document and querying a collection
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'; 

// Assuming '../../firebase' exports the Firestore instance as 'db'
import { db } from '../../firebase'; 

function PhotoFrame() {
  // Hardcoded ID for the Photo Frame category
  const PHOTO_FRAME_CATEGORY_ID = "268L0LwCRaAjBZdoY4ua"; 

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]); // State to hold the products list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let fetchedCategory = null;
      
      try {
        // --- 1. Fetch Category Details (from 'category' collection) ---
        const categoryRef = doc(db, 'category', PHOTO_FRAME_CATEGORY_ID); 
        const docSnap = await getDoc(categoryRef);

        if (docSnap.exists()) {
          fetchedCategory = docSnap.data();
          setCategory(fetchedCategory);
        } else {
          setError(`Category not found for ID: ${PHOTO_FRAME_CATEGORY_ID}`);
          setLoading(false);
          return;
        }

        // --- 2. Fetch Associated Products (from 'products' collection) ---
        // Queries the 'products' collection where the 'categoryId' matches the Photo Frame ID.
        const productsCollectionRef = collection(db, 'products');
        const productsQuery = query(
          productsCollectionRef,
          where('categoryId', '==', PHOTO_FRAME_CATEGORY_ID)
        );

        const productsSnapshot = await getDocs(productsQuery);
        
        if (!productsSnapshot.empty) {
            const productsList = productsSnapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            }));
            setProducts(productsList);
        } else {
            console.warn(`No products found for category ID: ${PHOTO_FRAME_CATEGORY_ID}`);
            setProducts([]);
        }

      } catch (err) {
        console.error('Error fetching data for Photo Frame:', err);
        // This is where Firebase Security Rules issues or connection errors surface.
        setError("Failed to fetch category or product details. Check Firebase setup/rules.");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchData();
  }, []); 

  // --- UI Rendering ---

  // 🔄 Loading UI
  if (loading)
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="warning" />
        <p className='text-white'>Loading Photo Frame Category and Products...</p>
      </Container>
    );

  // ⚠️ Error UI
  if (error)
    return (
      <Container className="text-center my-5 text-danger">
        <p>Error: {error}</p>
        <p className="text-secondary">Please verify your Firebase setup and Security Rules.</p>
      </Container>
    );

  // ✅ Success UI
  return (
    <Container className="my-5 text-center">
      <h2 className="fw-bold text-warning mb-4">{category.name || "Photo Frame"} Collection</h2>
      
      {/* Category Image */}
      {category.image && (
        <img
          src={category.image}
          alt={category.name}
          className="img-fluid rounded shadow-sm mb-3"
          style={{ maxWidth: '400px', maxHeight: '250px', objectFit: 'cover' }}
        />
      )}
      
      <p className="text-dark mb-5">
        {category.description || `Frame your precious memories with our beautiful photo frame collection!`}
      </p>
            
      {products.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {products.map(product => (
            <Col key={product.id}>
              <Card className="h-100 shadow-lg border-0 bg-dark text-white">
                <Card.Img 
                    variant="top" 
                    src={product.image || 'placeholder.jpg'} 
                    style={{ height: '150px', objectFit: 'cover' }} 
                />
                <Card.Body>
                  <Card.Title className="fs-6 text-truncate text-warning">{product.name || 'Untitled Frame'}</Card.Title>
                  <Card.Text className="text-light fw-bold">
                    {/* Assuming products have a price field */}
                    {product.price ? `$${product.price.toFixed(2)}` : 'Price N/A'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="p-4 bg-secondary bg-opacity-25 rounded">
          <p className="text-dark fw-bold mb-0">No products found for the {category.name || 'Photo Frame'} category yet.</p>
        </div>
      )}
    </Container>
  );
}

export default PhotoFrame;