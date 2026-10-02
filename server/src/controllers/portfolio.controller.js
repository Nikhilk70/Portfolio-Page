import { loadPortfolio, getSection, getProjects, getProjectBySlug } from '../services/data.service.js';

const ok = (res, data) => res.json({ success: true, data });

export const getAll = async (_req, res, next) => {
  try {
    ok(res, await loadPortfolio());
  } catch (e) {
    next(e);
  }
};

export const sectionHandler = (key) => async (_req, res, next) => {
  try {
    const data = await getSection(key);
    if (data === undefined) return res.status(404).json({ success: false, message: `Section "${key}" not found` });
    ok(res, data);
  } catch (e) {
    next(e);
  }
};

export const listProjects = async (req, res, next) => {
  try {
    const { featured } = req.query;
    const filter = featured === undefined ? {} : { featured: featured === 'true' };
    ok(res, await getProjects(filter));
  } catch (e) {
    next(e);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await getProjectBySlug(req.params.slug);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    ok(res, project);
  } catch (e) {
    next(e);
  }
};
