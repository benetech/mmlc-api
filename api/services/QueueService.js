module.exports = {
  
  processJobs: function() {
    sails.jobs.process('html5 conversion', function(job, done) { 
      //Update status of html5. 
      Html5.update({id: job.data.html5Id}, {status: 'processing'}).exec(function(err, html5s) {
        if (err) console.log(err);
      });
      ConversionService.convertHTML5(job.data, done);
    });
    sails.jobs.on('job complete', function(id,result){
      sails.kue.Job.get(id, function(err, job) {
        if (err) return;
        //Complete status.
        Html5.update({id: job.data.html5Id}, {status: 'completed'}).exec(function(err, html5s) {
          if (err) console.log(err);
        });
        job.remove(function(jobErr) { if (jobErr) throw jobErr; });
      });
    });
    sails.jobs.on('job failed', function(id,result) {
      sails.kue.Job.get(id, function(err, job) {
        if (err) return;
        //Complete status.
        Html5.update({id: job.data.html5Id}, {status: 'failed', comments: result}).exec(function(err, html5s) {
            if (err) console.log(err);
        });
      });
    });
  },

  submitHTML5ConversionJob: function(options, done) {
    var job = sails.jobs.create('html5 conversion', {title: 'Convert math in ' + options.filename, html5Id: options.id}).save(function(err) {
      if (!err) { 
        done();
      } else { 
        console.log(err);
        done({err: err});
      }
    });
  }

}
