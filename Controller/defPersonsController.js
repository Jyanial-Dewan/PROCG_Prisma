import prisma from "../DB/db.config.js";

export const defPersonsController = {
    async defPersons (req, res) {
        try {
            const result = await prisma.def_persons.findMany();
            return res.status(200).json(result)
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async uniqueDefPerson (req, res) {
        try {
            const defPersonID = Number(req.params.id);

        const findDefPerson = await prisma.def_persons.findUnique({
            where: {
                user_id: defPersonID
            }
        })

        if(!findDefPerson) {
           return res.status(404).json({message: "Person not found"})
        }
        
        return res.status(200).json(findDefPerson);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async createDerPerson (req, res) {
        try {
            const defPersonData = req.body;

            const findDefPerson = await prisma.def_persons.findUnique({
                where: {
                    user_id: defPersonData.user_id
                }
            })
    
            if(findDefPerson) {
               return res.status(408).json({message: "Person already exist"})
            }
    
            if(!defPersonData.first_name || !defPersonData.job_title || !defPersonData.user_id) {
                return res.status(422).json({message: "User_id, first_name and job_title is required"})
            }
    
            const newDefPerson = await prisma.def_persons.create({
                data: {
                    user_id: defPersonData.user_id,
                    first_name: defPersonData.first_name,
                    middle_name: defPersonData.middle_name,
                    last_name: defPersonData.last_name,
                    job_title: defPersonData.job_title
                }
            });
    
            return res.status(201).json(newDefPerson) 
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async deleteDefPerson (req, res) {
        try {
            const defPersonID = Number(req.params.id);

        const findDefPerson = await prisma.def_persons.findUnique({
            where: {
                user_id: defPersonID
            }
        })

        if(!findDefPerson) {
           return res.status(404).json({error: "Person not found"})
        }

        const deletedDefPerson = await prisma.def_persons.delete({
            where: {
                user_id: defPersonID
            }
        })

        return res.status(204).json({deletedDefPerson})
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async updateDefPerson (req, res) {
        try {
            const defPersonID = Number(req.params.id);
            const defPersonData = req.body;
    
            const findDefPerson = await prisma.def_persons.findUnique({
                where: {
                    user_id: defPersonID
                }
            })
    
            if(!findDefPerson) {
                return res.status(404).json({message: "Person not found"})
             }
    
             if(!defPersonData.first_name || !defPersonData.job_title) {
                return res.status(422).json({message: "first_name and job_title is required"})
            }
    
            const updatedDefPerson = await prisma.def_persons.update({
                where: {
                    user_id: defPersonID
                },
                data: {
                    first_name: defPersonData.first_name,
                    middle_name: defPersonData.middle_name,
                    last_name: defPersonData.last_name,
                    job_title: defPersonData.job_title
                }
            })
    
            return res.status(200).json({updatedDefPerson})  
        } catch (error) {
            return res.status(500).json({ error: error.message }); 
        }
    }
}