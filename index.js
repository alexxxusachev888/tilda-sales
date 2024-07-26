const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/webhook', async (req, res) => {
    const data = {
        "title": req.body.title, // назва заявки
        "source_id": 1, // ідентифікатор джерела
        "manager_comment": req.body.manager_comment, // коментар до заявки
        "manager_id": 1, // ідентифікатор відповідального менеджера
        "pipeline_id": req.body.pipeline_id, // ідентифікатор воронки (за відсутності параметра буде використана перша воронка у списку)
        "contact": [
            { "full_name": req.body.name }, // ПІБ покупця
            { "email": req.body.email }, // email покупця
            { "phone": req.body.phone } // номер телефону покупця
        ],
        "utm_source": req.body.utm_source, // джерело компанії
        "utm_medium": req.body.utm_medium, // тип трафіку
        "utm_campaign": req.body.utm_campaign, // назва компанії
        "utm_term": req.body.utm_term, // ключове слово
        "utm_content": req.body.utm_content // ідентифікатор оголошення
    };

    const dataString = JSON.stringify(data);

    const apiToken = (process.env.KEYCRM_API_KEY);
    const url = 'https://openapi.keycrm.app/v1/pipelines/cards';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
            body: dataString
        });

        const result = await response.json();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
