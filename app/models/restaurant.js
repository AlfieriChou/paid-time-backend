const LIMIT = 100

module.exports = Model => {
  return class extends Model {
    static async remoteRandom (ctx) {
      const restaurants = await ctx.models.Restaurant.find({
        where: {
          status: 'DEFAULT'
        },
        order: [
          ['seq', 'ASC']
        ],
        limit: LIMIT
      }, ctx)
      const restaurant = restaurants[restaurants.length - 1]
      if (!restaurant) {
        ctx.throw(400, '数据缺失')
      }
      const { seq } = restaurant
      const list = restaurants
        .map(item => {
          return new Array(seq - item.seq + 1).fill(1).map(_item => {
            return item
          })
        })
        .flat()
        .sort(() => { return Math.random() > 0.5 ? -1 : 1 })
      const randomRestaurant = list[Math.floor(Math.random() * list.length)]
      await ctx.models.Restaurant.increment({
        seq: 1
      }, {
        where: { id: randomRestaurant.id }
      })
      return randomRestaurant
    }
  }
}
