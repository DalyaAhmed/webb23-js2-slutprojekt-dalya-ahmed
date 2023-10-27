import React, { useState } from "react";

export default function SearchForm({ setSearchWord, setLatestSearches, latestSearches, onAddToCart }) {
    const [tempWord, setTempWord] = useState(''); // Use state to store the temporary word

    const handleChange = (e) => {
        setTempWord(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        e.target.reset();
        setSearchWord(tempWord);

        onAddToCart();

    }

    return (
        <form className='search-form' onSubmit={handleSubmit}>
            <input type="text" onChange={handleChange} className="search-form" />
            <button className="button-search">Search</button>
        </form>

    );
}
