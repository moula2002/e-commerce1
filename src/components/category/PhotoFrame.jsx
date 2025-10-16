import React, { useState, useEffect } from 'react';
import { Container, Spinner, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust path if needed

const extractColorFromDescription = (description) => {
    if (!description || typeof description !== 'string') return null;
    const match = description.match(/color:\s*([a-zA-Z]+)/i);
    return match ? match[1].trim() : null;
};

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    // ✅ Color logic: First check 'color' field, then description, default to "N/A"
    const productColor = product.color || extractColorFromDescription(product.description) || "N/A";

    const cardStyle = {
        transition: "transform 0.3s ease-in-out, boxShadow 0.3s ease-in-out",
        transform: isHovered ? "scale(1.03)" : "scale(1)",
        boxShadow: isHovered
            ? "0 8px 16px rgba(255, 193, 7, 0.4)" // Darker shadow for hover
            : "0 4px 8px rgba(0, 0, 0, 0.15)",
        zIndex: isHovered ? 10 : 1,
        cursor: 'pointer'
    };

    return (
        <Col>
            <Link to={`/product/${product.id}`} className="text-decoration-none"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>
                <Card className="h-100 border border-dark" style={cardStyle}>
                    <Card.Img
                        variant="top"
                        src={product.images || product.image || 'https://via.placeholder.com/150/000000/FFFFFF?text=No+Image'}
                        style={{ height: '180px', objectFit: "inherit" }}
                    />
                    <Card.Body>
                        <Card.Title className="fs-6 text-truncate text-dark">{product.name || 'Untitled Frame'}</Card.Title>
                        
                        {/* 🎨 Displaying the Color information */}
                        <Card.Text className="text-secondary small">
                            Color: <strong style={{ color: productColor !== 'N/A' ? 'black' : 'grey' }}>{productColor}</strong>
                        </Card.Text>

                        <Card.Text className="text-warning fw-bold fs-5 mt-2">
                            {product.price ? `₹${product.price}` : 'Price N/A'}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Link>
        </Col>
    );
};



function PhotoFrame() {
    // ✅ Category name is correctly set to PhotoFrame
    const categoryName = "Home";
    // ✅ Fetch limit is correctly set
    const fetchLimit = 20;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsCollectionRef = collection(db, 'products');

                const productsQuery = query(
                    productsCollectionRef,
                    where('category', '==', categoryName), // Filtering by category: "PhotoFrame"
                    limit(fetchLimit) // Limiting the fetch count
                );

                const productsSnapshot = await getDocs(productsQuery);

                if (!productsSnapshot.empty) {
                    const productsList = productsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setProducts(productsList);
                } else {
                    console.warn(`No products found for category: ${categoryName}`);
                    setProducts([]);
                }

            } catch (err) {
                console.error('Error fetching data for Photo Frame:', err);
                setError("Failed to fetch Photo Frame products. Please check your connection or Firestore rules.");
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        fetchData();
    }, []);

    if (loading)
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="warning" />
                <p className='text-dark'>Loading {categoryName} Products...</p>
            </Container>
        );

    if (error)
        return (
            <Container className="text-center my-5 text-danger">
                <p>Error: {error}</p>
                <p className="text-secondary">Verify the Firestore `products` collection and security rules.</p>
            </Container>
        );

    return (
        <Container className="my-5 text-center">
            <h2 className="fw-bold text-dark mb-4">Photo Frame🖼️</h2>
            {products.length > 0 ? (
                <Row xs={1} md={2} lg={4} className="g-4">
                    {products.map(product => (
                        // 🎯 Using the ProductCard component for better modularity and hover effects
                        <ProductCard key={product.id} product={product} /> 
                    ))}
                </Row>
            ) : (
                <div className="p-4 bg-secondary bg-opacity-25 rounded">
                    <p className="text-dark fw-bold mb-0">No products found for the {categoryName} category yet.</p>
                </div>
            )}
        </Container>
    );
}

export default PhotoFrame;