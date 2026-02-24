import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import '../styles/AutocompleteInput.css';

/**
 * DebouncedAutocomplete Component
 * 
 * Provides autocomplete suggestions with debouncing to reduce API calls.
 * Implements smart search patterns (beginning of word and after spaces).
 * 
 * Props:
 * - label: Form label text
 * - value: Current input value
 * - onChange: Callback function when value changes
 * - onSelect: Callback function when a suggestion is selected
 * - fetchSuggestions: Async function to fetch suggestions (takes query string)
 * - placeholder: Placeholder text
 * - debounceDelay: Debounce delay in ms (default: 300)
 * - minChars: Minimum characters to trigger suggestions (default: 1)
 * - required: Whether field is required
 */
const AutocompleteInput = ({
    label,
    value,
    onChange,
    onSelect,
    fetchSuggestions,
    placeholder = '',
    debounceDelay = 300,
    minChars = 1,
    required = false,
    disabled = false
}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const debounceTimer = useRef(null);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Debounced fetch suggestions
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (!value || value.length < minChars) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setLoading(true);
        debounceTimer.current = setTimeout(async () => {
            try {
                const response = await fetchSuggestions(value);
                if (response.data && response.data.data) {
                    setSuggestions(response.data.data);
                    setShowSuggestions(response.data.data.length > 0);
                    setSelectedIndex(-1);
                } else {
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
                setShowSuggestions(false);
            } finally {
                setLoading(false);
            }
        }, debounceDelay);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [value, minChars, debounceDelay, fetchSuggestions]);

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSelectSuggestion(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setShowSuggestions(false);
                break;
            default:
                break;
        }
    };

    // Handle suggestion selection
    const handleSelectSuggestion = (suggestion) => {
        onChange({ target: { value: suggestion } });
        onSelect && onSelect(suggestion);
        setShowSuggestions(false);
        setSuggestions([]);
        setSelectedIndex(-1);
    };

    // Close suggestions on blur (with slight delay to allow click on suggestion)
    const handleBlur = () => {
        setTimeout(() => {
            setShowSuggestions(false);
        }, 200);
    };

    // Highlight matching text in suggestions
    const highlightMatch = (text, query) => {
        const queryLower = query.toLowerCase();
        const textLower = text.toLowerCase();
        const index = textLower.indexOf(queryLower);

        if (index === -1) return text;

        return (
            <>
                {text.substring(0, index)}
                <strong>{text.substring(index, index + query.length)}</strong>
                {text.substring(index + query.length)}
            </>
        );
    };

    return (
        <Form.Group className="mb-3 autocomplete-group">
            <Form.Label>{label} {required && '*'}</Form.Label>
            <div className="autocomplete-container" ref={suggestionsRef}>
                <Form.Control
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => value && suggestions.length > 0 && setShowSuggestions(true)}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className="custom-form-control autocomplete-input"
                    required={required}
                    disabled={disabled}
                    autoComplete="off"
                />
                
                {loading && value && (
                    <div className="autocomplete-loading">
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Loading...
                    </div>
                )}

                {showSuggestions && suggestions.length > 0 && (
                    <div className="autocomplete-dropdown">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className={`autocomplete-item ${index === selectedIndex ? 'active' : ''}`}
                                onClick={() => handleSelectSuggestion(suggestion)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                {highlightMatch(suggestion, value)}
                            </div>
                        ))}
                    </div>
                )}

                {showSuggestions && value && suggestions.length === 0 && !loading && (
                    <div className="autocomplete-no-results">
                        No suggestions found
                    </div>
                )}
            </div>
        </Form.Group>
    );
};

export default AutocompleteInput;
