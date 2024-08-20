import React from 'react';
import PhraseComponent from "./PhraseComponent";

export default function PhraseWrapper({ words }) {
    return <div className="grid grid-cols-3 gap-5 p-4 border shawdow-md mt-2">
        {words.map((word, index) => (
            <PhraseComponent key={index} word={word}/>
        ))}
    </div>
    
}
