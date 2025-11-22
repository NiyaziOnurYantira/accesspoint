import { v4 as uuidv4 } from 'uuid';

const renderNewAccessPointPage = (req, res) => {
    const newId = uuidv4();
    res.render('newAccessPoint', { newId });
};

const renderAccessPointDetailPage = (req, res) => {
    const { id } = req.params;
    res.render('accessPointDetail', { id });
};

export default {
    renderNewAccessPointPage,
    renderAccessPointDetailPage
};
