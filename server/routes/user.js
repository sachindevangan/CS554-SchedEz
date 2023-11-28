import { Router } from "express";
import { userData } from "../data/index.js";
import validation from '../validation.js'
import { ObjectId } from "mongodb";

const router = Router();

router.get("/all-users", async (req, res) => {
    try {
      const response = await userData.getAllUsers(req.query);
      return res.status(200).send(response);
    } catch (e) {
      return res.status(e[0] || 500).send({ message: e[1] || "Internal Server Error" });
    };
  })
  
router.post("/all-users", async (req,res) => {
    const response = req.body
    // try {
    //   const id = req.body.id;
    //   if (!ObjectId.isValid(id)) {
    //     throw new Error('Invalid id');
    //   }
    // } catch (error) {
    //   if (error.message === 'Invalid id') {
    //     return res.status(400).json({ error: 'Invalid id' });
    //   } else if (error.message === 'No user with that id') {
    //     return res.status(404).json({ error: 'No user with that id' });
    //   } else {
    //     return res.status(500).json({ error: 'Internal Server Error' });
    //   }
    // }
    console.log("Route Hitting");
    
    try {
      const result = await userData.create(response.id, response.username, response.email)
      if(!result){
        return res.status(500).json({error: "Unable to add user in MongoDB"})
      }  
      // "Unable to add user in MongoDB" 
      return res.status(200).json(result);
    } catch (e) {
      return res.status(400).json({error: e})
    }
  });

  router.get('/:id', async (req,res) =>{
    try {
      const id = req.params.id;
      // if (!ObjectId.isValid(id)) {
      //   throw new Error('Invalid id');
      // }
      const user = await userData.get(id);
      console.log(user);
      if(!user){
        throw new Error('No user with that id');
      }
      return res.status(200).json({user});
    } catch (error) {
      if (error.message === 'Invalid id') {
        return res.status(400).json({ error: 'Invalid id' });
      } else if (error.message === 'No user with that id') {
        return res.status(404).json({ error: 'No user with that id' });
      } else {
        return res.status(500).json({ error: 'Internal Server Error' });
      };
    } 
  }).delete(async (req,res) => {
    const id = req.params.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
  
    try {
      const message = await userData.remove(id);
      if(!message){
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json({ userId: id, deleted: true });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  export default router;