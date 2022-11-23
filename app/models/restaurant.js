const LIMIT = 5

module.exports = Model => {
  return class extends Model {
    static async remoteRandom (ctx) {
      const count = await ctx.models.Restaurant.count({
        where: {
          status: 'DEFAULT'
        },
        distinct: true
      })
      const offset = count > LIMIT ? Math.floor(Math.random() * count) + 1 : 0
      const restaurants = await ctx.models.Restaurant.findAll({
        where: {
          status: 'DEFAULT'
        },
        order: [
          ['seq', 'ASC']
        ],
        offset: offset > LIMIT ? offset - LIMIT : offset,
        limit: LIMIT,
        raw: true
      })
      const restaurant = restaurants[restaurants.length - 1]
      if (!restaurant) {
        ctx.throw(400, '数据缺失')
      }
      const { seq } = restaurant
      const list = restaurants.map(item => {
        return new Array(seq - item.seq + 1).fill(1).map(_item => {
          return item
        })
      }).flat()
      const randomRestaurant = list[Math.floor(Math.random() * list.length) + 1]
      await ctx.models.Restaurant.increment({
        seq: 1
      }, {
        where: { id: randomRestaurant.id }
      })
      return randomRestaurant
    }
  }
}
