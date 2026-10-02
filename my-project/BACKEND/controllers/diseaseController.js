// BACKEND/controllers/diseaseController.js
// MySQL/Sequelize Disease Controller with support for search, filters, sorting, and pagination.

const { Op } = require('sequelize');
const Disease = require('../models/Disease');
const DiseaseCategory = require('../models/DiseaseCategory');

// ─── API CONTROLLER FUNCTIONS ───

exports.getDiseaseCategories = async (req, res, next) => {
  try {
    const categories = await DiseaseCategory.findAll();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

exports.getDiseases = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search = '', 
      category = '', 
      severity = '', 
      ageGroup = '', 
      gender = '', 
      dosha = '', 
      bodyPart = '', 
      sort = 'Newest' 
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const whereClause = {};

    // 1. Search filter
    if (search) {
      whereClause[Op.or] = [
        { diseaseName: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { symptoms: { [Op.like]: `%${search}%` } },
        { doshaAffected: { [Op.like]: `%${search}%` } }
      ];
    }

    // 2. Category filter
    if (category) {
      whereClause.category = category;
    }

    // 3. Severity filter
    if (severity) {
      whereClause.severity = severity;
    }

    // 4. Age Group filter (allows matching specific age or 'All')
    if (ageGroup) {
      whereClause[Op.and] = whereClause[Op.and] || [];
      whereClause[Op.and].push({
        [Op.or]: [{ ageGroup }, { ageGroup: 'All' }]
      });
    }

    // 5. Gender filter (allows matching specific gender or 'All')
    if (gender) {
      whereClause[Op.and] = whereClause[Op.and] || [];
      whereClause[Op.and].push({
        [Op.or]: [{ gender }, { gender: 'All' }]
      });
    }

    // 6. Dosha filter
    if (dosha) {
      whereClause.doshaAffected = { [Op.like]: `%${dosha}%` };
    }

    // 7. Body Part filter
    if (bodyPart) {
      whereClause.bodyPartsAffected = { [Op.like]: `%${bodyPart}%` };
    }

    // 8. Sorting options
    let orderClause = [['createdAt', 'DESC']];
    if (sort === 'Highest Rated') {
      orderClause = [['rating', 'DESC']];
    } else if (sort === 'Most Viewed') {
      orderClause = [['views', 'DESC']];
    } else if (sort === 'Oldest') {
      orderClause = [['createdAt', 'ASC']];
    } else if (sort === 'Alphabetical' || sort === 'A-Z') {
      orderClause = [['diseaseName', 'ASC']];
    } else if (sort === 'Recovery Time') {
      orderClause = [['recoveryTime', 'ASC']];
    }

    const { count, rows } = await Disease.findAndCountAll({
      where: whereClause,
      limit: limitNum,
      offset,
      order: orderClause
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(count / limitNum)
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getDiseaseBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    // We check both slug and id for backward compatibility
    const disease = await Disease.findOne({
      where: {
        [Op.or]: [
          { slug },
          { id: slug }
        ]
      }
    });

    if (!disease) {
      return res.status(404).json({ success: false, message: 'Disease not found' });
    }

    // Increment views
    await disease.increment('views', { by: 1 });
    // Reload so we return updated count
    await disease.reload();

    res.json(disease);
  } catch (err) {
    next(err);
  }
};

exports.getDiseaseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const disease = await Disease.findByPk(id);
    if (!disease) {
      return res.status(404).json({ success: false, message: 'Disease not found' });
    }
    res.json(disease);
  } catch (err) {
    next(err);
  }
};

exports.searchDiseases = async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    const items = await Disease.findAll({
      where: {
        [Op.or]: [
          { diseaseName: { [Op.like]: `%${q}%` } },
          { category: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
          { symptoms: { [Op.like]: `%${q}%` } },
          { doshaAffected: { [Op.like]: `%${q}%` } }
        ]
      },
      limit: 10
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.getDiseasesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const items = await Disease.findAll({
      where: { category }
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.getPopularDiseases = async (req, res, next) => {
  try {
    const items = await Disease.findAll({
      order: [['rating', 'DESC'], ['views', 'DESC']],
      limit: 6
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.getLatestDiseases = async (req, res, next) => {
  try {
    const items = await Disease.findAll({
      order: [['createdAt', 'DESC']],
      limit: 6
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.getTrendingDiseases = async (req, res, next) => {
  try {
    const items = await Disease.findAll({
      order: [['views', 'DESC'], ['bookmarks', 'DESC']],
      limit: 6
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.createDisease = async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.slug) {
      body.slug = body.diseaseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (!body.id) {
      body.id = `dis-${Date.now()}`;
    }
    const newDisease = await Disease.create(body);
    res.status(201).json({ success: true, data: newDisease });
  } catch (err) {
    next(err);
  }
};

exports.updateDisease = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    if (body.diseaseName && !body.slug) {
      body.slug = body.diseaseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    const disease = await Disease.findByPk(id);
    if (!disease) {
      return res.status(404).json({ success: false, message: 'Disease not found' });
    }
    await disease.update(body);
    res.json({ success: true, data: disease });
  } catch (err) {
    next(err);
  }
};

exports.deleteDisease = async (req, res, next) => {
  try {
    const { id } = req.params;
    const disease = await Disease.findByPk(id);
    if (!disease) {
      return res.status(404).json({ success: false, message: 'Disease not found' });
    }
    await disease.destroy();
    res.json({ success: true, data: disease });
  } catch (err) {
    next(err);
  }
};

exports.getSymptomCheckerData = async (req, res, next) => {
  try {
    const { getPool } = require('../config/db');
    const pool = getPool();
    if (!pool) {
      return res.json(require('../data/symptom_checker.json'));
    }
    const [rows] = await pool.query("SELECT * FROM symptom_checker_data");
    if (rows && rows.length > 0) {
      const result = {};
      rows.forEach(r => {
        try {
          result[r.category] = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
        } catch (e) {
          result[r.category] = r.data;
        }
      });
      return res.json(result);
    }
    res.json(require('../data/symptom_checker.json'));
  } catch (err) {
    next(err);
  }
};

