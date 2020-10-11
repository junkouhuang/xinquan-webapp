<template>
    <div id="app" v-if="isRouterAlive">
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
    </div>
</template>


<script>
    var vm = {
        name: 'App',
				provide(){
					return {
						reload:this.reload
					}
				},
				data(){
					return {
						isRouterAlive:this.reload
					}
				},
        watch: {
            $route(to) {
                if (to.name == 'drugList' || to.name == 'enterpriseList' || to.name == "buildList" || to.name == "authenticationList" || to.name == "credentialsList") {
                  // if(!to.meta.keepAlive){
                  //   to.meta.keepAlive = true;
                  // }
									console.log(to.name)
									to.meta.keepAlive = true;
                }
            }
        },
				methods:{
					reload(){
						this.isRouterAlive=false;
						this.$nextTick(function(){
							this.isRouterAlive=true;
						})
					}
				}
    }
    export default vm;
</script>
