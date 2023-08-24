import Suscription from "../models/suscriptions.model.js";

//suscriptions that belongs to the user.
export const getSuscriptions = async (req, res) => {
  try {
    const suscriptions = await Suscription.find({
      user: req.user.id,
    });
    res.json(suscriptions);
  } catch(err) {
    return res.status(500).json({ message: err.message });
  }
};
export const createSuscription = async (req, res) => {
  try {
    const newSuscription = new Suscription({
      community: req.params.id,
      user: req.user.id,
    });
    await newSuscription.save();
    res.json(newSuscription);
  } catch(err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteSuscription = async (req, res) => {
  try {
    const suscription = await Suscription.findOneAndDelete({
      community: req.params.id,
      user: req.user.id,
    });

    if (!suscription)
      return res.status(400).json({ message: "suscription not found" });
    return res.status(204).json({ message: "suscription deleted" });
  } catch(err) {
    return res.status(500).json({ message: err.message });
  }
};
