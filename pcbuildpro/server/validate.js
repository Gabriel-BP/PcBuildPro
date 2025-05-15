// server/validate.js
const { spawn } = require('child_process');

module.exports = (req, res) => {
    const componentes = req.body.componentes;
    if (!Array.isArray(componentes) || componentes.length === 0) {
        return res.status(400).json({ error: 'Componentes no válidos' });
    }

    const componentesArg = componentes.join('|').replace(/"/g, '');
    console.log("Ejecutando validación con componentes:", componentes);

    const pythonProcess = spawn('python', ['neo4j_validation.py', componentesArg], {
        cwd: __dirname,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' } // Forzar UTF-8 en Python
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
        output += data.toString('utf8');
    });

    pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString('utf8');
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`❌ Script terminado con código ${code}`);
            console.error(errorOutput || output);
            return res.status(500).json({ error: errorOutput || output || 'Error ejecutando script' });
        }

        console.log("✅ Validación completada:", output);
        res.json({ result: output });
    });
};
