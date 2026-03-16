import { Router } from 'express'
import { prisma } from '../db/client.js'

export const dataRouter = Router()

dataRouter.get('/segments', async (_req, res) => {
  const segments = await prisma.segment.findMany({
    include: { brands: true },
    orderBy: { wobPct: 'desc' },
  })
  res.json(segments)
})

dataRouter.get('/segments/:id', async (req, res) => {
  const segment = await prisma.segment.findUnique({
    where: { id: req.params.id },
    include: { brands: true, deviations: true, segmentTargets: true },
  })
  if (!segment) return res.status(404).json({ error: 'Segment not found' })
  res.json(segment)
})

dataRouter.get('/brands', async (_req, res) => {
  const brands = await prisma.brand.findMany({
    include: { segment: true },
    orderBy: { sharePct: 'desc' },
  })
  res.json(brands)
})

dataRouter.get('/retailers', async (_req, res) => {
  const retailers = await prisma.retailer.findMany({
    orderBy: { marketSharePct: 'desc' },
  })
  res.json(retailers)
})

dataRouter.get('/retailers/:groupId', async (req, res) => {
  const retailers = await prisma.retailer.findMany({
    where: { groupId: req.params.groupId },
    include: {
      retailerPricing: true,
      promoEfficiency: true,
      assortmentRecs: true,
      promoRecs: true,
      deviations: true,
      retailerTargets: true,
    },
  })
  if (retailers.length === 0) return res.status(404).json({ error: 'Retailer group not found' })
  res.json(retailers)
})

dataRouter.get('/deviations', async (req, res) => {
  const where: Record<string, unknown> = {}
  if (req.query.severity) where.severity = req.query.severity
  if (req.query.segmentId) where.segmentId = req.query.segmentId

  const deviations = await prisma.deviation.findMany({
    where,
    include: { segment: true, retailer: true },
    orderBy: { severity: 'asc' },
  })
  res.json(deviations)
})

dataRouter.get('/plan', async (_req, res) => {
  const plan = await prisma.annualPlan.findFirst()
  const segmentTargets = await prisma.segmentTarget.findMany()
  const retailerTargets = await prisma.retailerTarget.findMany()
  const buildingBlocks = await prisma.buildingBlock.findMany()
  res.json({ plan, segmentTargets, retailerTargets, buildingBlocks })
})

dataRouter.get('/promo-calendar', async (_req, res) => {
  const events = await prisma.promoCalendarEvent.findMany({
    include: { brand: true, retailer: true },
    orderBy: { startWeek: 'asc' },
  })
  res.json(events)
})

dataRouter.get('/pricing/:retailerGroupId', async (req, res) => {
  const pricing = await prisma.retailerPricing.findMany({
    where: { retailer: { groupId: req.params.retailerGroupId } },
    include: { brand: true, retailer: true },
  })
  res.json(pricing)
})
