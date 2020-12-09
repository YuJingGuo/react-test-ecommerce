import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Nav, Image, Form } from 'react-bootstrap'
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import env from './env'
import Products from './Products'
import '../utils/styles.css'

const sortOptions = [
    { value: null, title: "Choose ..." },
    { value: "price", title: "Price" },
    { value: "id", title: "ID" },
    { value: "size", title: "Size" }
]

function App() {
    const [ sponsors, setSponsors ] = useState('')
    const [ products, setProducts ] = useState([])    
    const [ productscount, setProductscount ] = useState(1)    
    const [ randAd, setRandAd ] = useState('')    
    const [ pageNumber, setPageNumber ] = useState(1)     
    const [ isFetching, setIsFetching ] = useInfiniteScroll(fetchMoreProducts)    
    const [ loading, setLoading ] = useState(true)
    const [ moreProducts, setMoreProducts ] = useState(true)
    const [ sort, setSort ] = useState('')
    const pageSize = 20

    useEffect(() => {        
        setSponsors(`${env.apiUrl}/ads/?r=${Math.floor(Math.random()*1000)}`)
        const firstFetch = async () => {
            setIsFetching(true)
            setLoading(true)
            await fetch(endpoint())
            .then(response => {
                setProductscount(+response.headers.get('X-Total-Count'))
                return response.json()
            })
            .then(res => {
                let products = res.concat(getAd());
                setProducts(products)
                setPageNumber(pageNumber+1)
                setIsFetching(false)
            })
        }
        firstFetch()
    }, [sort])                

    function fetchMoreProducts() {
        setLoading(true)
        fetch(endpoint())
        .then(response => {
            return response.json()
        })
        .then(res => {
            let buffer = res.concat(getAd())            
            let moreItems = products.length <= (productscount + (productscount/pageSize) - 1);
            setMoreProducts(moreItems)            
            if( moreProducts && res.length > 0) {
                setProducts(products.concat(buffer))
                setPageNumber(pageNumber+1)
                setIsFetching(false)
            } else {
                setLoading(false)
            }
        })
    }

    function endpoint() {
        let uri = `${env.apiUrl}/products?_page=${pageNumber}&_limit=${pageSize}`;
        if(sort !== null) {
            uri = `${uri}&_sort=${sort}`
        }
        return uri
    }

    function getAd() {
        let pid;
        do{
            pid = Math.floor(Math.random() * 1000);
        } while (randAd === pid);
        setRandAd(pid)
        return { pid };
    }

    const handleSorting = async (event) => {        
        await setProducts([])        
        await setPageNumber(1)        
        await setIsFetching(false)
        await setLoading(false)
        await setSort(event.target.value)
        await console.log(loading, isFetching)
    }

    return (
        <div>
            <Navbar collapseOnSelect expand="lg" style={{background: '#FFCE25'}}>
                <Navbar.Brand href="/"><h3>Products Grid</h3></Navbar.Brand>         
            </Navbar>

            <Container fluid>
                <Row style={{padding: "20px 0px 50px 0px"}}>
                    <Col sm="12">
                        <h6>Here you're sure to find a bargain on some of the finest ascii available to purchase. Be sure to peruse our selection of ascii faces in an exciting range of sizes and prices.</h6>
                    </Col>
                    <Col sm="12">
                        <h6>But first, a word from our sponsors:</h6> 
                    </Col>                                                        
                    <Col sm="12">
                        <Image src={sponsors} alt="sponsors" style={{borderRadius: 8}}/>
                    </Col>
                </Row>
                
                <Form.Group as={Row} className="sort-section">
                    <Col md="2" style={{display: "flex", alignItems: "center"}}>
                        <>
                            <h6>Sort:</h6>&nbsp;
                        </> 
                        <Form.Control  as="select" onChange={handleSorting}>
                            {
                                sortOptions.map((item, index) => {
                                    return (
                                        <option key={index} value={item.value}>{item.title}</option>
                                    )
                                })
                            }
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Row>
                    <Products products={products} loading={loading} isFetching={isFetching} productscount={productscount} pageSize={pageSize}/>             
                </Row>                                    
            </Container>       
        </div>        
    );
}

export default App;
