import { Badge, Button, Chip, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import CloudUploadIcon  from '@mui/icons-material/CloudUpload';
import jsPDF from 'jspdf'; // Bibliothèque pour générer le PDF
import '../css/ExpressionE.css';
import img from '../assets/tcf.jpg'
function ExpressionE() {
    const [timeLeft, setTimeLeft] = useState(3600); // 3600 secondes = 1 heure
    const [disabled, setDisabled] = useState(false); // Gère l'état du champ de texte (désactivé après 1h)
    const [tasks, setTasks] = useState({
        task1: '',
        task2: '',
        task3: ''
    });
    const [wordCounts, setWordCounts] = useState({
        wordCount1: 0,
        wordCount2: 0,
        wordCount3: 0
    });

    // Fonction pour compter les mots
    const handleTextChange = (e, task) => {
        const text = e.target.value.trim();
        const words = text.split(/\s+/).filter(Boolean); // Sépare les mots par espaces, filtre les espaces vides
        setTasks({
            ...tasks,
            [task]: e.target.value
        });

        // Met à jour le compteur de mots spécifique à chaque tâche
        setWordCounts({
            ...wordCounts,
            [`wordCount${task.slice(-1)}`]: text ? words.length : 0
        });
    };

    // Empêche la copie
    const handleCopy = (e) => {
        e.preventDefault(); // Empêche l'action de copie par défaut
        alert("La copie est désactivée pour ce champ.");
    };

    // Chronomètre
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    setDisabled(true); // Désactive les champs après 1 heure
                    clearInterval(timer);
                    saveAsPDF(); // Enregistre en PDF après 1 heure
                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format du temps restant (hh:mm:ss)
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Enregistre le contenu sous forme de PDF
    const saveAsPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);

        doc.text('Tâche 1:', 10, 10);
        doc.text(tasks.task1 || 'Aucun résultat saisi', 10, 20);

        doc.text('Tâche 2:', 10, 40);
        doc.text(tasks.task2 || 'Aucun résultat saisi', 10, 50);

        doc.text('Tâche 3:', 10, 70);
        doc.text(tasks.task3 || 'Aucun résultat saisi', 10, 80);

        doc.save('taches.pdf'); // Télécharge le fichier PDF
    };

    return (
        <div className='container'>
            <form className='form' style={{ margin: '20px' }}>
            <center> <img alt='img' src={img} style={{ width: '300px',borderRadius:20}}/></center>
                <p style={{ textAlign: 'center' }}> <h3>Simulateur Examen Expression Ecrite TCF Canada</h3></p>
                <p>Temps restant : <Chip label={formatTime(timeLeft)} color="error" ></Chip> </p> 

                {/* Tâche 1 */}
                <TextField
                    label="Tâche 1"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    autoFocus
                    disabled={disabled} // Désactive si le temps est écoulé
                    onChange={(e) => handleTextChange(e, 'task1')}
                    autoComplete="off"
                    spellCheck="false"
                    onCopy={handleCopy}
                    value={tasks.task1}
                />
                <p>Nombre de mots : &nbsp; <Badge badgeContent={wordCounts.wordCount1} max={999} color="primary"></Badge></p>

                {/* Tâche 2 */}
                <TextField
                    label="Tâche 2"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    disabled={disabled} // Désactive si le temps est écoulé
                    onChange={(e) => handleTextChange(e, 'task2')}
                    autoComplete="off"
                    spellCheck="false"
                    onCopy={handleCopy}
                    value={tasks.task2}
                    style={{ marginTop: '20px' }}
                />
                <p>Nombre de mots : &nbsp;  <Badge badgeContent={wordCounts.wordCount2} max={999} color="primary"></Badge></p>

                {/* Tâche 3 */}
                <TextField
                    label="Tâche 3"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    disabled={disabled} // Désactive si le temps est écoulé
                    onChange={(e) => handleTextChange(e, 'task3')}
                    autoComplete="off"
                    spellCheck="false"
                    onCopy={handleCopy}
                    value={tasks.task3}
                    style={{ marginTop: '20px' }}
                />
                <p>Nombre de mots : &nbsp;  <Badge badgeContent={wordCounts.wordCount3}  max={999} color="primary"></Badge></p>

                <Button variant="contained" endIcon={<CloudUploadIcon  />} style={{ marginTop: '20px' }} onClick={saveAsPDF} disabled={disabled}>
                    Enregistrer en PDF
                </Button>
            </form>
        </div> 
    );
}

export default ExpressionE;
