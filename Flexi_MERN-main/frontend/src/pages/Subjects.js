import React, { useState } from 'react';

const Subjects = () => {
    const [subject, setSubject] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubjectChange = (e) => setSubject(e.target.value);

    const fetchBookRecommendations = async () => {
        if (!subject) {
            setError('Please enter a subject to get recommendations.');
            return;
        }

        setLoading(true);
        setError(null);
        setBooks([]);

        try {
            const response = await fetch('http://localhost:5000/api/generate-books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject })
            });

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            
            const data = await response.json();

            if (data.books) {
                setBooks(data.books);
            } else {
                setError('No book recommendations available for this subject.');
            }
        } catch (err) {
            setError('Failed to fetch book recommendations. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="subjects-container">
            <h2>Book Recommendations</h2>
            <input 
                type="text" 
                value={subject} 
                onChange={handleSubjectChange} 
                placeholder="Enter a subject" 
            />
            <button onClick={fetchBookRecommendations} disabled={loading}>
                {loading ? 'Loading...' : 'Get Recommendations'}
            </button>
            {error && <p className="error">{error}</p>}
            <div className="book-list">
                {books.map((book, index) => (
                    <div key={index} className="book-item">
                        <h4>{book.title}</h4>
                        <p>Author: {book.author}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Subjects;
