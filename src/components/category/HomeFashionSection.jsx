import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { db } from "../../firebase"; 
import { 
    collection, 
    query, 
    where, 
    orderBy, 
    limit, 
    startAt, 
    getDocs 
} from "firebase/firestore";
import { Link } from "react-router-dom";

// Helper function to generate a random number (0 to 1) for the query cursor
const getRandomCursor = () => Math.random();

function HomeFashionSection() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // No need for refreshKey state, as the randomCursor in the dependency array
    // will change on every component mount (page refresh)

    useEffect(() => {
        const fetchRandomFashionProducts = async () => {
            setLoading(true);
            
            const randomCursor = getRandomCursor();
            const categoryName = "Fashion";
            const productLimit = 5;

            try {
                const productsRef = collection(db, "products");
                
                // 1. Order the entire dataset by the random key.
                // 2. Start the query at a random point in that ordered list (randomCursor).
                // 3. Limit to 5.
                let q = query(
                    productsRef,
                    where("category", "==", categoryName),
                    orderBy("random_sort_key"), // MUST exist in all documents
                    startAt(randomCursor),
                    limit(productLimit)
                );
                
                const snapshot = await getDocs(q);
                let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

                // 🚨 Handle wrap-around: If the starting point was near 1, we might get fewer than 5 results.
                // In this case, run a second query starting from the beginning (0).
                if (data.length < productLimit) {
                    const remainingLimit = productLimit - data.length;
                    
                    const wrapQ = query(
                        productsRef,
                        where("category", "==", categoryName),
                        orderBy("random_sort_key"),
                        limit(remainingLimit)
                    );
                    
                    const wrapSnapshot = await getDocs(wrapQ);
                    const wrapData = wrapSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

                    data = [...data, ...wrapData]; // Combine the results
                }

                setProducts(data);

            } catch (err) {
                console.error("🔥 Error fetching random products. Check 'random_sort_key' and indexes:", err);
                // Fallback to a non-random query in case of index/field errors
                const productsRef = collection(db, "products");
                const fallbackQ = query(productsRef, where("category", "==", "Fashion"), orderBy("name"), limit(5));
                const fallbackSnapshot = await getDocs(fallbackQ);
                setProducts(fallbackSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            } finally {
                setLoading(false);
            }
        };

        fetchRandomFashionProducts();
    }, []); // Empty dependency array ensures it runs once per component mount (page load)

    return (
        <Container className="my-5 text-center">
            {loading ? (
                <Spinner animation="border" variant="warning" />
            ) : (
                <>
                    <Row xs={1} sm={2} md={3} lg={5} className="g-4 justify-content-center">
                        {products.map((product) => (
                            <Col key={product.id}>
                                <Link to={`/product/${product.id}`} className="text-decoration-none d-block">
                                    <Card className="product-card h-100 shadow-sm border-0">
                                        <div className="image-container">
                                            <Card.Img
                                                variant="top"
                                                src={
                                                    product.image ||
                                                    product.images ||
                                                    "https://via.placeholder.com/200x200.png?text=No+Image"
                                                }
                                                alt={product.name}
                                            />
                                        </div>
                                        <Card.Body>
                                            <Card.Title className="fs-6 text-truncate text-dark">
                                                {product.name}
                                            </Card.Title>
                                            <Card.Text className="text-success fw-bold">
                                                ₹{product.price}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>

                    <div className="mt-4">
                        <Link to="/fashion">
                            <Button variant="warning" size="lg" className="px-4 fw-bold">
                                Show More →
                            </Button>
                        </Link>
                    </div>
                </>
            )}
        </Container>
    );
}

export default HomeFashionSection;