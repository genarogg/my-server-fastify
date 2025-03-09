import { Helmet } from 'react-helmet';

interface HeadProps {}

const Head: React.FC<HeadProps> = () => {
    return (
        <>
            <Helmet>
                <title>Healthcheck | Genarogg</title>
                <meta name="description" content="Healthcheck" />
                <meta name="robots" content="noindex" />
                <link rel="stylesheet" href="/css/healthcheck.css" />
            </Helmet>
        </>
    );
}

export default Head;