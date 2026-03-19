import Header from './Header';

const Home = ({children}) => {
    return (
        <div className="page" id='home-page'>
            <Header></Header>
            <div id='main'>
                {/* <Title></Title> */}
                {children} 
            </div>
        </div>
    );
}

export default Home