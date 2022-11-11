import React, { Component } from 'react';
import { Chart } from 'primereact/chart';

export class BarChart extends Component {

    constructor(props) {
        super(props);

        this.basicData = {
            labels: ['Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre','Octubre'],
            datasets: [
                {
                    label: 'Ingresos',
                    backgroundColor: '#42A5F5',
                    data: [65531, 59586, 80475, 81147, 56256, 55140, 60256, 55968]
                },
                {
                    label: 'Egresos',
                    backgroundColor: '#FFA726',
                    data: [28145, 48111, 70584, 69362, 60200, 60500, 55050, 55996]
                }
            ]
        };

       

        this.options = this.getLightTheme();
    }

    getLightTheme() {
        let basicOptions = {
            maintainAspectRatio: false,
            aspectRatio: .8,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        let horizontalOptions = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: .8,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

     

        

        return {
            basicOptions,
            horizontalOptions,
           
        }
    }

    render() {
        const { basicOptions, horizontalOptions } = this.options;

        return (
            <div>
                <div>
                    <h5>Ingresos y Egresos en Ciclo Lectivo</h5>
                    <Chart type="bar" data={this.basicData} options={basicOptions} />
                </div> 

                {/* <div className="card">
                    <h5>Ingresos y Egresos en Ciclo Lectivo</h5>
                    <Chart type="bar" data={this.basicData} options={horizontalOptions} />
                </div> */}
            </div>
        )
    }
}
                