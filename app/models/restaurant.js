module.exports = Model => {
  return class extends Model {
    static async remoteRandom (ctx) {
      const count = await ctx.models.Restaurant.count({
        where: {
          status: 'DEFAULT'
        },
        distinct: true
      })
      const offset = Math.floor(Math.random() * count) + 1
      const restaurants = await ctx.models.Restaurant.findAll({
        where: {
          status: 'DEFAULT'
        },
        order: [
          ['seq', 'ASC']
        ],
        offset: offset > 5 ? offset - 5 : offset,
        limit: 5,
        raw: true
      })
      const restaurant = restaurants[restaurants.length - 1]
      if (!restaurant) {
        ctx.throw(400, '数据缺失')
      }
      const { seq } = restaurant
      const list = restaurants.map(item => {
        return new Array((seq - item.seq) || 1).fill(1).map(_item => {
          return item
        })
      }).flat()
      return list[Math.floor(Math.random() * list.length) + 1]
    }
  }
}
